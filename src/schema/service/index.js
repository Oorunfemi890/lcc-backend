'use strict';

(() => {

    module.exports = {
        serviceCreate: require('./service-create.schema'),
        serviceGetAll: require('./service-get-all.schema'),
        serviceById: require('./service-id.schema'),
        serviceUpdate: require('./service-update.schema'),
    };

})();