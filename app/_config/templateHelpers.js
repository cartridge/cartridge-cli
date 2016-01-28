module.exports = function() {

    /**
     * Set of handlebar helpers that can be used in templates
     */

    return {
        /**
         * Get the string value of a JSON object, useful for debugging template data
         *
         * @param  {Object} obj JSON object
         * @return {String}     Provided object as a string
         *
         * @example
         * {{ json data }}
         */
        json: function(obj) {
            return JSON.stringify(obj);
        },
        /**
         * Helper that gives condition checking
         *
         * @param  {*} v1               First variable
         * @param  {String} operator    Type of comparison to be made
         * @param  {*} v2               Second variable to compare
         * @param  {Object} options     Handlebars options object, not required to be passed in
         * @return {Boolean}            Condition result
         *
         * @example
         * {{#ifCondition var1 '==' var2}} ..render if condition is true... {{/ifCondition}}
         */
        ifCondition: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        },
        /**
         * Helper that repeats blocks of code, providing an index to be utilised
         *
         * @param  {Bool} 	n           Number of times to repeat a code block
         * @param  {Obj} 	options
         * @return {String}             HTML string of content to be put into template
         *
         * @example
         * {{#repeat 4}} <h{{@index}}>Hello, World!</h{{@index}}> {{/repeat}}
         */
    	repeat: function (n, options) {
         	var content = '',
         	count = n - 1;

         	for (var i = 0; i <= count; i++) {
         		var data = {
         			index: i + 1
         		};
         		content += options.fn(this, {data: data});
         	}

         	return content;
         }
    }
}
