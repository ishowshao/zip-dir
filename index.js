const fs = require('fs');
const archiver = require('archiver');

/**
 * @param {string} directory directory path to archive
 * @param {string} zip output zipfile path
 * @param {function} callback callback after zip
 */
module.exports = (directory, zip, callback) => {
    const output = fs.createWriteStream(zip);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    output.on('close', function () {
        if (typeof callback === 'function') {
            callback();
        } else {
            throw new Error('callback must be function.');
        }
    });

    archive.on('warning', function (err) {
        if (err.code === 'ENOENT') {
            console.log(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function (err) {
        throw err;
    });

    archive.pipe(output);
    archive.directory(directory, false);
    archive.finalize();
}