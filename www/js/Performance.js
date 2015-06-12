/**
 * @class Performance
 *
 * Provides an API to measure timings of operations and code execution.
 */
var Performance = (function () {
    /*********************
     * Internal properties
     *********************/
    var Performance = {};

    /**
     * List of start time epochs indexed by their reference names
     * @type {object}
     */
    var startRefs = {};

    /*******************
     * Public properties
     *******************/

    /*************
     * Public API
     *************/
    /**
     * Initialises the  performance API, applying a polyfill if native support is not found.
     */
    Performance.init = function () {
        if (!window.performance || !window.performance.now){
            polyfill();
        }
    };

    /**
     * Starts performance measurement for a given reference name
     * @param {string} ref_name - reference name to start measuring (used for displaying measured time)
     * @returns {integer} - epoch of start reference
     */
    Performance.startMeasuring = function (ref_name) {
        startRefs[ref_name] = performance.now();
        return startRefs[ref_name];
    };

    /**
     * Inserts a start measurement epoch for the given reference name
     * @param {string} ref_name - reference name to insert start for
     * @param {integer} epoch - start epoch to insert
     */
    Performance.insertStartMeasurement = function (ref_name, epoch) {
        startRefs[ref_name] = epoch;
    };

    /**
     * Returns flag indicating if a start measurement exists for the given reference name
     * @param {string} ref_name - reference name to check for
     * @returns {boolean} true if a start reference exists for the given reference name
     */
    Performance.hasStartMeasurement = function (ref_name) {
        return !!startRefs[ref_name];
    };

    /**
     * Ends performance measurement for a given reference name and logs elapsed time between start and end.
     * @param {string} ref_name - reference name to finish measuring (used for displaying measured time).
     * This must previously have been used to start a measurement by calling Util.startMeasuring().
     * @param {Object} opts (optional) - optional settings:
     * <ul>
     * <li> preserveRefs {boolean} - if true, starting and ending timestamps will not be cleared after logging. Defaults to false.</li>
     * </ul>
     * @returns {integer} - elapsed time in milliseconds between start and end refs
     */
    Performance.stopMeasuring = function (ref_name, opts) {
        opts = opts ? opts : {};
        if (!startRefs || !startRefs[ref_name]){
            console.error("No start measurement found for '" + ref_name + "'. Must call Util.startMeasuring() with ref_name before Util.stopMeasuring()");
            return -1;
        }

        if (!Performance.endRefs){
            Performance.endRefs = {};
        }
        Performance.endRefs[ref_name] = performance.now();

        var time = Performance.getMeasuredTime(ref_name);
        console.log("TIMING: '" + ref_name + "' in " + time + "ms");

        if (!opts.preserveRef){
            Performance.clearMeasurements(ref_name);
        }
        return time;
    };
    /**
     * Returns measured execution time for a given reference name.
     * @param {string} ref_name - reference name to return measured execution time for.
     * This must previously have been used to start a measurement by calling Util.startMeasuring()
     * and to end a measurement by calling Util.stopMeasuring();
     * @returns {integer} - elapsed time in milliseconds between start and end refs
     */
    Performance.getMeasuredTime = function (ref_name) {
        if (!startRefs || !startRefs[ref_name]){
            throw new Error("No start measurement found for '" + ref_name + "'. Must call Util.startMeasuring() with ref_name before Util.getMeasurement()");
        }
        if (!Performance.endRefs || !Performance.endRefs[ref_name]){
            throw new Error("No end measurement found for '" + ref_name + "'. Must call Util.stopMeasuring() with ref_name before Util.getMeasurement()");
        }
        return Math.round(Performance.endRefs[ref_name] - startRefs[ref_name]);
    };
    /**
     * Clears store measured execution time for a given reference name (if they exist).
     * @param {string} ref_name - reference name to clear store execution times for.
     */
    Performance.clearMeasurements = function (ref_name) {
        if (startRefs && startRefs[ref_name]){
            delete startRefs[ref_name];
        }
        if (Performance.endRefs && Performance.endRefs[ref_name]){
            delete Performance.endRefs[ref_name];
        }
    };


    /********************
     * Internal functions
     ********************/

    /**
     * Provides a polyfill of window.performance() across browsers if native support is not detected.
     */
    function polyfill () {
        window.performance = window.performance || {};
        window.performance.now = function () {
            return performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
                    return new Date().getTime();
                };
        }();
    }

    return Performance;
})();
