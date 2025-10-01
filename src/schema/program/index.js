'use strict';

(() => {

    module.exports = {
        programCreate: require('./program-create.schema'),
        programGetAll: require('./program-get-all.schema'),
        programById: require('./program-by-id.schema'),
        programUpdate: require('./program-update.schema'),
    };

})();