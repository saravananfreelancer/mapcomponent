var React = require('react');  
const { InfoBox } = require("react-google-maps/lib/components/addons/InfoBox");
var requestify = require("requestify");
var async = require("async");


import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";


const MapWithAMarker = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    options={{ scrollwheel: false,gestureHandling: 'none',streetViewControl:false,mapTypeControl: false,zoomControl: false}}
    center={{"lat":props.zoom.lat,lng:props.zoom.lng}}
    zoom={props.zoom.zoomlevel}
    ref={(map)=>{props.mapbound(map)}}
  >   
    {
      props.info && props.info.length > 0 ?
      props.info.map(function(details,i){
          return (<InfoBox key={i}
            defaultPosition={new google.maps.LatLng(details.lat, details.lng)}
            options={{ closeBoxURL: ``, enableEventPropagation: true }}>
            <div style={{ backgroundColor: `black`,color:"#fff", opacity: 0.75,borderRadius:"3px", padding: `5px` }}>
              <div style={{ fontSize: `16px`, fontColor: `#08233B` }}>
                {details.text}
              </div>
            </div>
          </InfoBox>)
      }):null

    }
  </GoogleMap>
));

var Annotation = React.createClass({  
  compontDidMount:function(){
    this.setState({"info":[]})
  },
  onMapClick:function(pos){
    var lat = pos.latLng.lat();
    var lng = pos.latLng.lng();
    var annotationName = prompt("Please provide text for this location");
    var annotation = this.state && this.state.info?this.state.info:[];
    annotation.push({"lat":lat,"lng":lng,text:annotationName})
    this.setState({"info":annotation});
  },
  loadData:function(){
    var data = (this.refs.textarea.value);
    try {
      data = JSON.parse(data);
      /*if(Array.isArray(data) && data.length > 0) {
        data.map((curData) => {
          if(curData.lat && curData.lng && curData.text){
            annotation.push({"lat":curData.lat,"lng":curData.lng,text:curData.text})            
          } else {
            console.warn(curData,'Not loaded is must be [{"lat":13,"lng":80,text:"test"}]')
          }
          
        })
      }*/
      this.callApi(data)
    } catch(e){
      alert("Not a valid JSON format")
    } 
  },
  callApi:function(data){
      async.forEachOf(data, (value, key, callback) => {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCKl6d0xRZaz5vhJEjXXuWVURyYJ0fVC9g&address="+value.address;
        $.getJSON(url, function (response) {
            data[key].googleRes = response && response.results && response.results.length > 0?response.results[0]:false;
            callback()
        })
      }, err => {
        this.annotateMap(data);
      });
    
  },
  annotateMap:function(data){
    var annotation = this.state && this.state.info?this.state.info:[];   
    var latlngbounds = new google.maps.LatLngBounds();    
    data.map((curData,i) => {
      if(curData.googleRes && curData.googleRes.geometry && curData.googleRes.geometry.location){        
        annotation.push({"lat":curData.googleRes.geometry.location.lat,"lng":curData.googleRes.geometry.location.lng,text:curData.label});
        latlngbounds.extend(new google.maps.LatLng(curData.googleRes.geometry.location.lat, curData.googleRes.geometry.location.lng));
      }
    })
    var centerLoc = latlngbounds.getCenter();
    this.latlngbounds = latlngbounds;
    this.setState({"info":annotation,lat:centerLoc.lat(),"lng":centerLoc.lng()});
  },
  zoomtoPos:function(obj,i){    
    this.setState({lat:obj.lat,"lng":obj.lng,active:i,zoomlevel:12})
  },
  componentDidUpdate:function(){
    var _this = this;
    this.map.fitBounds(this.latlngbounds)
    debugger;
  },
  mapbound:function(key){
    this.map = (key);
  },
 	render: function () {
	  var zoom={zoomlevel:this.state && this.state.zoomlevel?this.state.zoomlevel:2,lat:this.state && this.state.lat?this.state.lat:13,lng:this.state && this.state.lng?this.state.lng:80}
    console.log(zoom)
	  return (	    
      <div>
      <textarea ref="textarea" className="textarea">{JSON.stringify([{"label":"House 1 (1997-2012)","address":"3 Glen Park Rd, Eltham North Victoria, Australia"},{"label":"House 2 (2013-2016)","address":"16 View St, Mount Evelyn, Victoria, AUSTRALIA"},{"label":"House 3 (2017-present)","address":"10 River Gum Dr, Croydon North, Victoria, AUSTRALIA"}])}</textarea>
      <input type="button" className="btn btn-primary" onClick={this.loadData} value="Load Data" /> 
      <div>
          <ul className="list-inline area-list hide">
              {
                this.state && this.state.info ?this.state.info.map((list,i) => {
                    return(<li key={i} className={i==this.state.active?'button-box  active':'button-box '} onClick={this.zoomtoPos.bind(this,list,i)}>{list.text}</li>)
                }):null
              }
          </ul>
      </div>     
      <MapWithAMarker
          ref="main"
          info = {this.state && this.state.info ?this.state.info:[]}
          zoom={zoom}
          mapbound ={this.mapbound}
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKl6d0xRZaz5vhJEjXXuWVURyYJ0fVC9g&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}>          
    </MapWithAMarker>
      </div>
	   )
	}
});

module.exports = Annotation;