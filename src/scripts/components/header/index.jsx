var React = require('react');  

var Header = React.createClass({  
 	render: function () {
	  
	   return (
	    
<nav className="navbar navbar-inverse">
  <div className="container-fluid">
    <div className="navbar-header">
      <a className="navbar-brand" href="#">Map App</a>
    </div>
    <ul className="nav navbar-nav">
      <li><a href="/">Country color</a></li>
      <li><a href="/annotation">map annotation</a></li>
      <li><a href="/help">help</a></li>
    </ul>
  </div>
</nav>
	   )
	}
});

module.exports = Header;