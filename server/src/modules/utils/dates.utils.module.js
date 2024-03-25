// check if functions are valid, if not, return invalid operation, if both are valid but init_date > end_date, swap them
function swapDatesIfPossible(_init_date, _end_date) {
    try {
        // cast '' to NULL
        // check which date is higher or lower to send it 
        if ((!_init_date && !_end_date) && !(_init_date instanceof Date) || !(_end_date instanceof Date)) {
            // swap if _end_date < _init_date
            let _tmp_date = _init_date;
            _init_date = _init_date < _end_date ? _init_date : _end_date;
            _end_date = _init_date === _tmp_date ? _end_date : _tmp_date;
        }
        // change possible values of NaN, undefined... to NULL
        _init_date = _init_date === '' || _init_date === undefined ? null : _init_date;
        _end_date = _end_date === '' || _end_date === undefined ? null : _end_date;
        return { status: _init_date === null || _end_date === null, init_date: _init_date, end_date: _end_date }
    } catch (error) {
        return { status: false, _init_date: null, _end_date: null }
    }
}

module.exports = { swapDatesIfPossible }