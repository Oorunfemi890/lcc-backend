'use strict';

(() => {

    module.exports = {
        memberCreate: require('./member-create.schema'),
        memberGetAll: require('./member-get-all.schema'),
        memberById: require('./member-by-id.schema'),
        memberUpdate: require('./member-update.schema'),
        memberBlock: require('./member-block.schema'),
    };

})();