import React, { PropTypes } from 'react';
import Radium from 'radium';
import {LoaderIndeterminate} from '../';
import {baseStyles} from './editorModalStyle';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const EditorModalPublish = React.createClass({
	propTypes: {
		handlePublish: PropTypes.func,
		intl: PropTypes.object,
	},

	getInitialState() {
		return {
			versionState: 'Draft',
			versionDescription: '',
			isPublishing: false,
		};
	},

	handleStateClick: function(newState) {
		return ()=>{
			this.setState({versionState: newState});	
		};
	},
	handleDescriptionChange: function(event) {
		this.setState({versionDescription: event.target.value});
	},

	handlePublish: function() {
		this.setState({isPublishing: true});
		this.props.handlePublish(this.state.versionState, this.state.versionDescription);
	},

	render: function() {
		const messages = defineMessages({
			descriptionPlaceholder: {
				id: 'collections.descriptionPlaceholder',
				defaultMessage: 'e.g. Initial draft version,or updating dataset caption',
			},
		});

		return (
			<div>
				<div style={styles.loaderWrapper}>
					{(this.state.isPublishing ? <LoaderIndeterminate color="#555"/> : null)}
				</div>

				<div style={baseStyles.topHeader}>
					<FormattedMessage 
						id="editor.publish"
						defaultMessage="Publish"/>
				</div>

				{/* Draft or Review-ready option 
					Should default to review-ready if a past version was */}
				<div style={styles.optionContainer}>
					<div style={styles.optionHeader}>
						<FormattedMessage 
							id="editor.versionState"
							defaultMessage="version state"/>
					</div>
					<div style={styles.optionChoices}>
						<span key={'publishModal-draft'} onClick={this.handleStateClick('Draft')} style={[styles.option, this.state.versionState === 'Draft' && styles.optionActive]}>
							<FormattedMessage {...globalMessages.draft} />
						</span>
						<span style={styles.optionSeparator}>|</span> 
						<span key={'publishModal-journal'} onClick={this.handleStateClick('PeerReviewReady')} style={[styles.option, this.state.versionState === 'PeerReviewReady' && styles.optionActive]}>
							<FormattedMessage 
								id="editor.readyForReview"
								defaultMessage="ready for peer-review"/>
						</span>
					</div>
				</div>

				{/* Version message input */}
				<div style={styles.optionContainer}>
					<div style={styles.optionHeader}>
						<FormattedMessage 
							id="editor.versionDescription"
							defaultMessage="version description"/>
					</div>
					<textarea onChange={this.handleDescriptionChange} style={styles.messageTextarea} placeholder={this.props.intl.formatMessage(messages.descriptionPlaceholder)}></textarea>
				</div>

				{/* Publish Message */}
				<div style={styles.publishText}>
					<p style={styles.publishTextP}>
						<FormattedMessage 
							id="editor.publishMessage1"
							defaultMessage="You can publish versions to your Pub as frequently as you like."/>
					</p> 
					<p style={styles.publishTextP}>
						<FormattedMessage 
							id="editor.publishMessage2"
							defaultMessage="We encourage you to publish early and often."/>
					</p> 
					<p style={styles.publishTextP}>
						<FormattedMessage 
							id="editor.publishMessage3"
							defaultMessage="The full history will be maintained and accessible."/>
					</p>
				</div>

				{/* Publish button */}
				<div key="publish-button" style={styles.publishButton} onClick={this.handlePublish}>
					<FormattedMessage 
						id="editor.publishButton"
						defaultMessage="Publish version"/>
				</div>
			</div>
		);
	}
});

export default injectIntl(Radium(EditorModalPublish));

styles = {
	optionContainer: {
		padding: '15px 25px 40px 25px',
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
	},
	loaderWrapper: {
		position: 'absolute',
		width: '100%',
		top: 10,
	},
	optionHeader: {
		fontFamily: baseStyles.rowHeaderFontFamily,
		fontSize: baseStyles.rowHeaderFontSize,
		height: '30px',
	},
	optionChoices: {
		padding: '5px 0px',
	},
	option: {
		color: globalStyles.veryLight,
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		},
	},
	optionSeparator: {
		padding: '0px 10px',
	},
	optionActive: {
		color: 'black',
		':hover': {
			cursor: 'default',
			color: 'black',
		},
	},
	messageTextarea: {
		outline: 'none',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#aaa',
		resize: 'none',
		margin: '15px 0px',
		fontSize: '15px',
		height: 30,
		width: '100%',
		maxWidth: 600,
	},
	publishText: {
		padding: '5px 25px',
		fontSize: '18px',
	},
	publishTextP: {
		margin: 0,
		padding: 0,
	},
	publishButton: {
		fontSize: '35px',
		padding: '25px',
		textAlign: 'right',
		marginLeft: 'calc(100% - 230px - 50px)',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
	}
};
