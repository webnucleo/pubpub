/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let TabListComponent;
export const TabList = React.createClass({
	propTypes: {
		children: PropTypes.node,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		TabListComponent = require('@blueprintjs/core').TabList;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <TabListComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default TabList;
