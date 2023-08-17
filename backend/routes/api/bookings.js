const express = require('express');
const { Spot, Review, SpotImage, User, ReviewImage, Booking, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { validateReviewParams } = require('./validators')
const { Op } = require("sequelize");

const router = express.Router();

// get all bookings of current user
router.get('/current-user', requireAuth, async (req, res) => {
    const userId = req.user.id
    const bookings = await Booking.findAll({
        where: { userId: userId },
        include: {
            model: Spot,
            include: {
                model: SpotImage,
                attributes: [[sequelize.col('url'), 'previewImage']],
                where: { preview: true },
                required: false
            },
            attributes: [
                'id',
                ['userId', 'ownerId'],
                'address',
                'city',
                'state',
                'country',
                'lat',
                'lng',
                'name',
                'price',
            ]
        },
    })
    let bookingsArray = []
    for (let book of bookings) {
        const bookingData = book.toJSON()
        if (!bookingData.Spot.SpotImages[0] || bookingData.Spot.SpotImages === []) {
            bookingData.Spot.previewImage = null
        } else {
            bookingData.Spot.previewImage = bookingData.Spot.SpotImages[0]['previewImage']
        }
        delete bookingData.Spot.SpotImages
        bookingsArray.push(bookingData)
    }
    res.send({ "Bookings": bookingsArray })
});

// edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const currUserId = req.user.id
    const { bookingId } = req.params
    const { startDate, endDate } = req.body
    const existingBooking = await Booking.findByPk(bookingId)
    let currDate = new Date()
    let currDateOnly = currDate.toISOString().split('T')[0]

    if (existingBooking) {
        if (currUserId === existingBooking.userId) {
            if (existingBooking.endDate < currDateOnly) {
                res.status(403);
                res.json({
                    "message": "Past bookings can't be modified"
                })
            }
            if (endDate < startDate) {
                res.status(400).json({
                    "message": "Bad Request",
                    "errors": {
                        "endDate": "endDate cannot come before startDate"
                    }
                })
            }
            const existingSpot = await Spot.findByPk(existingBooking.spotId)
            const bookings = await existingSpot.getBookings()
            for (let booking of bookings) {
                const bookingObj = booking.toJSON()
                if ((startDate >= bookingObj.startDate && startDate <= bookingObj.endDate) || (endDate >= bookingObj.startDate && endDate <= bookingObj.endDate)) {
                    res.status(403);
                    res.send(
                        {
                            "message": "Sorry, this spot is already booked for the specified dates",
                            "errors": {
                                "startDate": "Start date conflicts with an existing booking",
                                "endDate": "End date conflicts with an existing booking"
                            }
                        }
                    )
                }
            }
            if (startDate !== undefined) existingBooking.startDate = startDate
            if (endDate !== undefined) existingBooking.endDate = endDate
            await existingBooking.save()
            res.json(existingBooking)
        } else {
            res.status(403)
            return res.json({
                "message": "Forbidden"
            })
        }
    } else {
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found",
        })
    }
});

// delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
    const currUserId = req.user.id
    const { bookingId } = req.params
    const existingBooking = await Booking.findByPk(bookingId)
    let currDate = new Date()
    let currDateOnly = currDate.toISOString().split('T')[0]

    if (existingBooking) {
        const existingBookingObj = existingBooking.toJSON()
        const spotOwner = await Spot.findOne({ where: { id: existingBookingObj.spotId } })
        const spotOwnerObj = spotOwner.toJSON()
        if (existingBookingObj.startDate < currDateOnly) {
            res.status(403);
            res.json({
                "message": "Bookings that have been started can't be deleted"
            })
        }
        if (currUserId === existingBookingObj.userId || currUserId === spotOwnerObj.userId) {
            await existingBooking.destroy()
            res.json({
                "message": "Successfully deleted"
            })
        } else {
            res.status(403)
            return res.json({
                "message": "Forbidden"
            })
        }
    }
    if (!existingBooking) {
        res.status(404);
        return res.json({
            "message": "Booking couldn't be found",
        })
    }
});

module.exports = router;