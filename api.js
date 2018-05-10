const express = require('express');
const router = express.Router();
const amortizer = require('./amortizer')

router.post('/calculate', (req, res) => {
    let rate = Number.parseFloat(req.body.rate)
    let period = Number.parseFloat(req.body.period)
    let amount = Number.parseFloat(req.body.amount);

    if (rate < 1 && period < 1 && amount < 1) {
        res.json({ success: false, message: 'Please provide values greater than 0' })
    }
    else {
        let monthlyRate = amortizer.computePMT(rate, period, amount).monthlyAmount.toFixed(2);
        let totalInterest = amortizer.computePMT(rate, period, amount).totalInterest.toFixed(2);

        return res.json({
            success: true,
            message: `Your query for ${amount} payable in ${period} months at ${rate}% p.a has a monthly installment of K${monthlyRate} and total interest of ${totalInterest}`, amount: monthlyRate,
            totalInterest: totalInterest,
            totalPayment: totalInterest + amount
        })
    }
});

router.post('/get-schedule', (req, res) => {
    let rate = Number.parseFloat(req.body.rate)
    let period = Number.parseFloat(req.body.period)
    let amount = Number.parseFloat(req.body.amount);

    if (rate < 1 && period < 1 && amount < 1) {
        res.json({ success: false, message: 'Please provide values greater than 0' })
    }
    else {
        return res.json({
            schedule: amortizer.computeSchedule(amount, rate, 12, period, amortizer.computePMT(rate, period, amount)),
            success: true
        })
    }
});

module.exports = router;