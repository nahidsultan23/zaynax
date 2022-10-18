const removeSpacesFromString = (string) => {
    let newString = string.replace(/ /g, '');

    return newString;
};

const allUpperCases = (string) => {
    let newString = string.toUpperCase();

    return newString;
};

const twoCharactersMonthAndDate = (date) => {
    let splittedDate = date.split('-');
    let newDate = splittedDate[0] + '-' + splittedDate[1].padStart(2, '0') + '-' + splittedDate[2].padStart(2, '0');

    return newDate;
};

const upToTwoDecimal = (number) => {
    let newNumber = Number.parseInt(number * 100) / 100;

    return newNumber;
};

module.exports = {
    removeSpacesFromString: removeSpacesFromString,
    allUpperCases: allUpperCases,
    twoCharactersMonthAndDate: twoCharactersMonthAndDate,
    upToTwoDecimal: upToTwoDecimal,
};
