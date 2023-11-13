
function makeFirstCharUppcase(str) {
    const f = str[0].toUpperCase();
    str = f + str.substring(1, str.length);
    return str;
}

function getFileName(str) {
    let res = str.match(/[A-Z]+[a-z0-9]*/g);
    if (!res) return '';
    res = res.map(f => f.toLowerCase());
    return res.join('-');
}

module.exports = {
    makeFirstCharUppcase,
    getFileName,
};