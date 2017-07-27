define(function(require, exports, module){
	var Handlebars = require("handlebars");
	//IFCODE == === < > <= >= && DE
	Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

	    switch (operator) {
	    	case '!=':
	    		return (v1 != v2) ? options.fn(this) : options.inverse(this);
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
	});

	// 这是截取字符串的方法
	Handlebars.registerHelper ('truncate', function (str, len) {
        if (str.length > len) {
            var new_str = str.substr (0, len+1);

            while (new_str.length) {
                var ch = new_str.substr ( -1 );
                new_str = new_str.substr ( 0, -1 );

                if (ch == ' ') {
                    break;
                }
            }

            if ( new_str == '' ) {
                new_str = str.substr ( 0, len );
            }

            return new Handlebars.SafeString ( new_str +'...' );
        }
        return str;
    });

	Handlebars.registerHelper('addOne',function(index){
		this.index = index+1;
		return this.index;
	});
//	多表达式使用:{{#expression a '==' b '&&' c '>' 0}}{{/expression}}
	Handlebars.registerHelper('expression', function() {
	    var exps = [];
	 	try{
		 	//最后一个参数作为展示内容，也就是平时的options。不作为逻辑表达式部分
		 	var arg_len = arguments.length;
			var len = arg_len-1;
			for(var j = 0;j<len;j++){
				exps.push(arguments[j]);
			}
			var result = eval(exps.join(' '));
			if (result) {
			  return arguments[len].fn(this);
			} else {
			  return arguments[len].inverse(this);
			}
	 	}catch(e){
	 		throw new Error('Handlerbars Helper "expression" can not deal with wrong expression:'+exps.join(' ')+".");
	 	}
 	});

	/*{{#switch state}} switch用法说明
		{{#case "page1" "page2"}}toolbar{{/case}}
		{{#case "page1" break=true}}page1{{/case}}
		{{#case "page2" break=true}}page2{{/case}}
		{{#case "page3" break=true}}page3{{/case}}
		{{#default}}page0{{/default}}
	{{/switch}}*/
	Handlebars.registerHelper("switch", function(value, options) {
		this._switch_value_ = value;
		var html = options.fn(this); // Process the body of the switch block
		delete this._switch_value_;
		return html;
	});
	Handlebars.registerHelper("case", function() {
		// Convert "arguments" to a real array - stackoverflow.com/a/4775938
		var args = Array.prototype.slice.call(arguments);

		var options    = args.pop();
		var caseValues = args;

		if (caseValues.indexOf(this._switch_value_) === -1) {
			return '';
		} else {
			return options.fn(this);
		}
	});
//	千分位分割:千分位分割就是把123456789这样的值格式化为123,456,789,使用方法:可以在模板中使用：{{formatnumber num}}
	Handlebars.registerHelper('formatnumber', function(num, options){
		if(!num.toString().split(".")[1]){
            	num = num + '';
            	return(num.replace(/(?=(?!^)(?:\d{3})+(?:\.|$))(\d{3}(\.\d+$)?)/g,',$1'));
            }else{
            		 num = num.toString().replace(/\$|\,/g,'');

			    // 检查传入数值为数值类型
			     if(isNaN(num))
			      num = "0";
			
			    // 获取符号(正/负数)
			    sign = (num == (num = Math.abs(num)));
			
			    num = Math.floor(num*Math.pow(10,2)+0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
			    cents = num%Math.pow(10,2);       // 求出小数位数值
			    num = Math.floor(num/Math.pow(10,2)).toString();  // 求出整数位数值
			    cents = cents.toString();        // 把小数位转换成字符串,以便求小数位长度
			
			    // 补足小数位到指定的位数
			    while(cents.length<2)
			     cents = "0" + cents;
			
			    if(1) {
			     // 对整数部分进行千分位格式化.
			     for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
			      num = num.substring(0,num.length-(4*i+3))+','+ num.substring(num.length-(4*i+3));
			    }
			
			    if (2 > 0)
			     return( (((sign)?'':'-') + num + '.' + cents));
			    else
			     return( (((sign)?'':'-') + num));
            }
		
          
     });
     //序号计算
	Handlebars.registerHelper('multiplyAdd', function(num1, num2, num3){
		return num1*(num2-1)+num3+1;
	})
})