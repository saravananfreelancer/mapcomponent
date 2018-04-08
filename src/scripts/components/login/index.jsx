var React = require('react');  
var Reflux = require('reflux'); 
var _ = require("underscore");
var Login = React.createClass({ 
	componentDidMount:function(){
		this.map = new Datamap({
		  element: document.getElementById('regions_div'),
		  responsive: false,
		  geographyConfig: {
	        highlightOnHover: false,
	        popupOnHover: false
	      },
	      fills: {
	      defaultFill: '#ccc'
	      }, 
		});
	},
	changeColor:function(countryCode,color){
		var obj = {};
		obj[countryCode] = color;
		this.map.updateChoropleth(obj);
	},
	loadData:function(){
		var data = (this.refs.textarea.value);
		try {
			data = JSON.parse(data);
			if(Array.isArray(data) && data.length > 0) {
				data.map((curData) => {
					if(curData.country && curData.color){
						this.changeColor(curData.country,curData.color)
					} else {
						console.warn(curData,'Not loaded is must be [{"country":"IN","color":"red"}]')
					}
					
				})
			}
		} catch(e){
			alert("Not a valid JSON format")
		}
	},
	render: function () {
	  
	   return (
	   <div>
	   	<textarea ref="textarea" className="textarea">{JSON.stringify([{"country":"IND","color":"red"}])}</textarea>
	   	<input type="button" className="btn btn-primary" onClick={this.loadData} value="Load Data" />
	    <div id="regions_div" className="mapcomponent col-md-12"></div>
	    </div>
	   )
	}
});

module.exports = Login;