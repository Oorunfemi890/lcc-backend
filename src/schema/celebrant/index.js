'use strict';

(() => {

    module.exports = {
        findAllCelebrants: require('./find-all-celebrants.scjema'),
        deleteCelebrant: require('./delete-celebrant.schema'),
        updateCelebrant: require('./update-celebrant.schema'),
        createCelebrant: require('./create-celebrant.schema'),

    };

})();