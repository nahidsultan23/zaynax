const chai = require('chai');
const expect = chai.expect;

const services = require('../../helper/services');

describe('Check removeSpaceFromString() in services.js', () => {
    it('should check remove spaces from a string', () => {
        let result = services.removeSpacesFromString('a b cd efg ');

        expect(result).to.be.equal('abcdefg');
    });
});

describe('Check allUpperCases() in services.js', () => {
    it('should change all the alphabets to uppercase', () => {
        let result = services.allUpperCases('abcd EFGH 123');

        expect(result).to.be.equal('ABCD EFGH 123');
    });
});

describe('Check twoCharactersMonthAndDate() in services.js', () => {
    it('should change the month and the date to two characters', () => {
        let result = services.twoCharactersMonthAndDate('2021-2-7');

        expect(result).to.be.equal('2021-02-07');
    });

    it('should not do anything if the month and the date are already two characters', () => {
        let result = services.twoCharactersMonthAndDate('2021-02-07');

        expect(result).to.be.equal('2021-02-07');
    });
});

describe('Check upToTwoDecimal() in services.js', () => {
    it('should remove the numbers after the two decimal point', () => {
        let result = services.upToTwoDecimal(25.36547);

        expect(result).to.be.equal(25.36);
    });
});
