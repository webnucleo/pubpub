import dateFormat from 'dateformat';
import Radium from 'radium';
import React, {PropTypes} from 'react';
import {renderReactFromJSON} from 'components/AtomTypes/Document/proseEditor';
import {schema} from 'components/AtomTypes/Document/proseEditor';
import {markdownSerializer} from 'components/AtomTypes/Document/proseEditor';
import {FormattedMessage} from 'react-intl';
import { Link } from 'react-router';
import {StoppableSubscription} from 'subscription';
import {globalMessages} from 'utils/globalMessages';
import {globalStyles} from 'utils/styleConstants';
// import {safeGetInToJS} from 'utils/safeParse';


let styles = {};
let pmThread;

export const DiscussionThreadInput = React.createClass({
	propTypes: {
		publishThreadReply: PropTypes.func,
		showTitle: PropTypes.bool,
		loggedIn: PropTypes.bool,
		loginQuery: PropTypes.string,
		linkTarget: PropTypes.string,
	},

	getInitialState() {
		return {
			title: '',
			error: undefined,
		};
	},

	componentDidMount() {
		const prosemirror = require('prosemirror');
		const {pubpubSetup} = require('components/AtomTypes/Document/proseEditor/pubpubSetup');

		const place = document.getElementById('reply-thread-input');
		if (!place) { return undefined; }
		pmThread = new prosemirror.ProseMirror({
			place: place,
			schema: schema,
			plugins: [pubpubSetup.config({menuBar: false, tooltipMenu: false})],
			doc: null,
			on: {
				doubleClickOn: new StoppableSubscription,
			}
		});

		// pmThread.on.change.add((evt)=>{
		// 	this.proseChange();
		// });

		pmThread.on.doubleClickOn.add((pos, node, nodePos)=>{
			if (node.type.name === 'embed') {
				const done = (attrs)=> {
					pmThread.tr.setNodeType(nodePos, node.type, attrs).apply();
				};
				window.toggleMedia(pmThread, done, node);
				return true;
			}
		});
	},

	submitThreadReply: function() {
		if (this.props.showTitle && !this.state.title) {
			return this.setState({error: 'A discussion title is required.'});
		}

		const markdown = markdownSerializer.serialize(pmThread.doc);
		if (!markdown) {
			return this.setState({error: 'Discussion content is required.'});
		}

		this.props.publishThreadReply(this.state.title, pmThread);
	},

	render: function() {
		return (
			<div style={styles.container}>
				{this.props.loggedIn &&
					<div>
						{this.props.showTitle &&
							<input type="text" placeholder={'Discussion Title'} value={this.state.title} onChange={(evt)=>{this.setState({title: evt.target.value});}} style={styles.title}/>
						}
						<div style={styles.replyBox}>
							<div id={'reply-thread-input'} className={'atom-reader atom-reply ProseMirror-quick-style'} style={styles.wsywigBlock}></div>
						</div>
						<button className={'button'} onClick={this.submitThreadReply}>{this.props.showTitle ? 'Submit New Discussion' : 'Submit Reply'}</button>
						{this.state.error &&
							<div style={styles.error}>{this.state.error}</div>
						}
					</div>
				}

				{!this.props.loggedIn &&
					<Link target={this.props.linkTarget} to={'/login' + this.props.loginQuery} style={globalStyles.link}>
						<div style={styles.loginMessage}><FormattedMessage id="discussion.LoginToPost2" defaultMessage="Login to add discussion"/></div>
					</Link>
				}

			</div>
		);
	}
});

export default DiscussionThreadInput;

styles = {
	container: {
		marginBottom: '2em',
	},
	replyBox: {
		boxShadow: '0px 1px 3px 1px #BBBDC0',
		backgroundColor: 'white',
		zIndex: 2,
		position: 'relative',
		marginBottom: '1em',
	},
	title: {
		width: 'calc(100% - 23px)',
		margin: '1em 0em 0.5em',
	},
	wsywigBlock: {
		width: '100%',
		minHeight: '4em',
	},
	error: {
		color: '#D8000C',
	},
	loginMessage: {
		textAlign: 'center',
		padding: '1em 0em',
		border: '1px solid #777',
	},

};