'use strict';

(() => {

    module.exports = {
        memberCreate: require('./member-create.schema'),
        memberCreateChild: require('./member-create-child.schema'),
        memberGetAll: require('./member-get-all.schema'),
        memberById: require('./member-by-id.schema'),
        memberUpdate: require('./member-update.schema'),
        memberBlock: require('./member-block.schema'),
        memberLookup: require('./member-lookup.schema'),
        memberGetChildren: require('./member-get-children.schema'),
        updateProfile: require('./member-update-profile.schema'),
    };

})();