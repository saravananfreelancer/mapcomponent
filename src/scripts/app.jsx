import React from "react";
import $ from "jquery";
import { Router, Route, IndexRoute, useRouterHistory } from "react-router";
import { render } from "react-dom";
import createBrowserHistory from "history/lib/createBrowserHistory";
import Header from "./components/header/index"
"use strict";

import Login from "./components/login";
import Annotation from "./components/annotation";
import Help from "./components/help";

var App = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },

    render() {
        return (
            <div>
                <Header />              
                <div className="container">
                    <div className="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = App;


const appHistory = useRouterHistory(createBrowserHistory)({ queryKey: false });

// Renders the main app into the DOM
render((
    <Router history={appHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Login}/>
            <Route path="annotation" component={Annotation}/>  
            <Route path="help" component={Help}/>  
        </Route>
    </Router>
), document.getElementById("app"));
