//Loan Amortizer
let functions = {
    computePMT: (rate, months, amount) => {

        // Convert interest from a percentage to a decimal, and convert from
        // an annual rate to a monthly rate. 
        //Convert payment period in years to the number of monthly payments.
        let principal = Number.parseFloat(amount);
        let interest = Number.parseFloat(rate) / 100 / 12;
        let payments = Number.parseFloat(months / 12) * 12;


        // compute the monthly payment figure
        let x = Math.pow(1 + interest, payments); //Math.pow computes powers
        let monthly = (principal * x * interest) / (x - 1);
        let totalInterest = (monthly * payments) - amount;

        return { monthlyAmount: monthly, totalInterest: totalInterest };
    },

    computeSchedule: (loanAmount, rate, period) => {
        let schedule = [];

        //get the remaining amount to be repaid
        let remaining = loanAmount;

        //deduce the principal amount, interest on remaining balance 
        //add to the schedule
        for (let i = 0; i <= Math.round(period-1); i++) {

            let payment = functions.computePMT(rate, period, loanAmount).monthlyAmount;
            let interest = remaining * (rate / 100 / 12);
            let principal = (payment - interest);
            remaining -= principal;
            let row = [i, principal > 0 ? (principal < payment ? principal : payment) : 0, interest > 0 ? interest : 0, remaining > 0 ? remaining : 0];
            schedule.push({
                paymentNo: i,
                principal: principal,
                interest: interest,
                monthlyTotal: payment,
                balance: remaining
            });
        }
        return schedule;
    }
}

module.exports = functions;