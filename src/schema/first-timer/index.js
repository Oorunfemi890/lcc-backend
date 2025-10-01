'use strict';

(() => {

    module.exports = {
        createFirstTimer: require('./create-first-timer.schema'),
        getAllFirstTimers: require('./get-all-first-timers.schema'),
        getFirstTimer: require('./get-first-timer.schema'),
        updateFirstTimer: require('./update-first-timer.schema'),
        deleteFirstTimer: require('./delete-first-timer.schema'),
    };

})();