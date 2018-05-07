//Loan Amortizer
let functions = {
    computePMT: (rate, months, amount) => {
        var pvif, pmt;

        //present value interest factor
        //nper = total payments
        pvif = Math.pow(1 + rate, months);

        //present payment value
        //pv: present value
        //pvif: present value interest factor
        pmt = (rate/100) / (pvif - 1) * -(amount * pvif);
        
        return -pmt;
    },

    computeSchedule: (loan_amount, interest_rate, payments_per_year, years, payment) => {
        var schedule = [];

        //get the remaining amount to be repaid
        var remaining = loan_amount;

        //first get the number of payments in the period
        var number_of_payments = payments_per_year * years;

        //deduce the pricinciple amount, interest on remaining balance 
        //add to the schedule
        for (var i = 0; i <= number_of_payments; i++) {
            var interest = remaining * (interest_rate / 100 / payments_per_year);

            var principle = (payment - interest);

            var row = [i, principle > 0 ? (principle < payment ? principle : payment) : 0, interest > 0 ? interest : 0, remaining > 0 ? remaining : 0];

            schedule.push(row);

            remaining -= principle;
        }

        return schedule;
    }
}
module.exports = functions;