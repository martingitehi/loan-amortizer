//Loan Amortizer
let functions = {
    computePMT: (rate, months, amount) => {

        // Get the user's input from the input elements.
        // Convert interest from a percentage to a decimal, and convert from
        // an annual rate to a monthly rate. Convert payment period in years
        // to the number of monthly payments.
        let principal = Number.parseFloat(amount);
        let interest = Number.parseFloat(rate) / 100 / 12;
        let payments = Number.parseFloat(months) * 12;

        // compute the monthly payment figure
        let x = Math.pow(1 + interest, payments); //Math.pow computes powers
        let monthly = (principal * x * interest) / (x - 1);

        // let pvif, pmt;

        // //present value interest factor
        // //nper = total payments
        // pvif = Math.pow(1 + rate, months);

        // //present payment value
        // //pv: present value
        // //pvif: present value interest factor
        // pmt = (rate / 100) / (pvif - 1) * -(amount * pvif);

        return monthly;
    },

    computeSchedule: (loan_amount, interest_rate, payments_per_year, years, payment) => {
        let schedule = [];

        //get the remaining amount to be repaid
        let remaining = loan_amount;

        //first get the number of payments in the period
        let number_of_payments = payments_per_year * years;

        //deduce the pricinciple amount, interest on remaining balance 
        //add to the schedule
        for (let i = 0; i <= number_of_payments; i++) {
            let interest = remaining * (interest_rate / 100 / payments_per_year);

            let principle = (payment - interest);

            let row = [i, principle > 0 ? (principle < payment ? principle : payment) : 0, interest > 0 ? interest : 0, remaining > 0 ? remaining : 0];

            schedule.push(row);

            remaining -= principle;
        }

        return schedule;
    }
}
module.exports = functions;