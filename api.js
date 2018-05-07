const express = require('express');
const router = express.Router();
const amortizer = require('./amortizer')

router.post('/calculate', (req, res) => {
    let rate = Number.parseFloat(req.body.rate)
    let period = Number.parseFloat(req.body.period)
    let amount = Number.parseFloat(req.body.amount);

    if (rate < 1 && period < 1 && amount < 1) {
        res.json({ message: 'Please provide values greater than 0' })
    }
    else {
        let monthlyRate = amortizer.computePMT(rate, period, amount);
        return res.json(`Your query for ${amount} payable in ${period} months at ${rate}% p.a has a monthly installment of K,${monthlyRate}`)
    }
});

router.post('/get-schedule', (req, res) => {
    let rate = Number.parseFloat(req.body.rate)
    let period = Number.parseFloat(req.body.period)
    let amount = Number.parseFloat(req.body.amount);

    return res.json({ schedule: amortizer.computeSchedule(amount, rate, 12, period, amortizer.computePMT(rate, period, amount)) })
});

module.exports = router;