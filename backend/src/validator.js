function validDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length !== 3) {
        return false;
    }
    const [year, month, day] = parts;
    if (year.length !== 4 || month.length !== 2 || day.length !== 2) {
        return false;
    }
    if (month < 1 || month > 12) {
        return false;
    }
    if (day < 0 || day > 31) {
        return false;
    }
    let date = new Date(year, month - 1, day);
    return date.getFullYear() !== NaN && date.getMonth() !== NaN && date.getDay() !== NaN;
}

function validUsername(username) {
    return false;
}

function validTag(tag) {
    return false;
}

module.exports = [validDate, validUsername, validTag];
