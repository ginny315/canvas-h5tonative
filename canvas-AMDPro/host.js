define([], function (argument) {
    var urlObj = {
        dev: {
            api: '',
            img:''
        },
        test: {
            api: '',
            img:''
        },
        release: {
            api: '',
            img:''
        }
    };
    var environment = 'test';
    return urlObj[environment];
});