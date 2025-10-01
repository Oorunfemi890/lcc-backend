'use strict';

(() => {

    module.exports = {
        createFollowUp: require('./create-follow-up.schema'),
        deleteFollowUp: require('./delete-follow-up.schema'),
        getAllFollowUps: require('./get-all-follow-up.schema'),
        getFollowUpById: require('./get-follow-up-by-id.schema'),
        updateFollowUp: require('./update-follow-up.schema'),
    };

})();