const mongoose = require('mongoose');

const DictionarySchema = new mongoose.Schema({
    indonesia: {
        type: String,
        required: true,
        index: true
    },
    daerah: {
        type: String,
        required: true,
        index: true
    },
    lontara: {
        type: String,
        default: ''
    },
    kelas: {
        type: String,
        default: 'Umum'
    }
}, {
    collection: 'dictionary',
    timestamps: false
});

module.exports = mongoose.model('Dictionary', DictionarySchema);
