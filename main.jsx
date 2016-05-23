import React from 'react';
import { _ } from 'meteor/underscore';
import { Accounts, STATES } from 'meteor/std:accounts-ui';
import { T9n } from 'meteor/softwarerero:accounts-t9n';

// XXX Remove when this PR is merged:
T9n.map('en', {
  alert: {
    ok: 'Ok',
    type: {
      info: 'Notice',
      error: 'Error',
      warning: 'Warning'
    }
  }
});

/**
 * Form.propTypes = {
 *   fields: React.PropTypes.object.isRequired,
 *   buttons: React.PropTypes.object.isRequired,
 *   error: React.PropTypes.string,
 *   ready: React.PropTypes.bool
 * };
 */
class Form extends Accounts.ui.Form {
  constructor(props) {
    super(props);
    this.state = {
      showPasswordForm: false
    };
  }

  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      message,
      ready = true,
      className,
      formState
    } = this.props;
    const { showPasswordForm } = this.state;
    return (
      <form ref={(ref) => this.form = ref} className={[ "accounts ui form", className ].join(' ')}>
        { showPasswordForm && (formState == STATES.SIGN_IN || formState == STATES.SIGN_UP) ? (
          <div className="padding switch-back" style={{ textAlign: "center"}}>
            <Accounts.ui.PasswordOrService formState={ formState } oauthServices={ oauthServices } />
          </div>
        ) : (
          <div className="padding">
            { formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
                <Accounts.ui.SocialButtons formState={ formState } oauthServices={ oauthServices } />
            ) : null }
          </div>
        )}
        <div className="padding">
          { formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
            <div className="or-sep">
              <span>{ T9n.get('OR').toLowerCase() }</span>
              <hr />
            </div>
          ) : null }
        </div>
        { showPasswordForm ? (
          <div>
            {Object.keys(fields).length > 0 ? (
              <Accounts.ui.Fields fields={ fields } formState={ formState } />
            ): null }
            <div className="padding">
              { buttons['switchToPasswordReset'] ? (
                <div className="field">
                  <Accounts.ui.Button {...buttons['switchToPasswordReset']} className="button-light" />
                </div>
              ): null }
              {_.values(_.omit(buttons, 'switchToPasswordReset', 'switchToSignIn',
                'switchToSignUp', 'switchToChangePassword', 'switchToSignOut', 'signOut')).map((button, i) =>
                <Button {...button} key={i} />
              )}
              { buttons['signOut'] ? (
                <Button {...buttons['signOut']} type="submit" />
              ): null }
              { buttons['switchToChangePassword'] ? (
                <Button {...buttons['switchToChangePassword']} type="link" className="button-block" />
              ): null }
              <Accounts.ui.FormMessage className="ui message" style={{display: 'block'}} {...message} />
            </div>
          </div>
        ) : (
          <div className="padding">
            <div className="field">
              <Accounts.ui.Button
                label={ T9n.get('signUpWithYourEmailAddress') }
                className="button-block"
                type={ 'submit' }
                onClick={ () => this.setState({ showPasswordForm: true }) }
              />
            </div>
          </div>
        )}

        { buttons['switchToSignOut'] ? (
          <Button {...buttons['switchToSignOut']} type="link" className="button-block" />
        ): null }
        <hr />
        <div className="list clean switch">
          { buttons['switchToSignIn'] ? (
            <div className="item item-button-right">
              { T9n.get('ifYouAlreadyHaveAnAccount') }
              <Button
                {...buttons['switchToSignIn']}
                type="link"
                className="button button-outline button-assertive"
              />
            </div>
          ): null }
          { buttons['switchToSignUp'] ? (
            <div className="item item-button-right">
              { T9n.get('dontHaveAnAccount') }
              <Button
                {...buttons['switchToSignUp']}
                type="link"
                className="button button-outline button-assertive"
              />
            </div>
          ): null }
        </div>
      </form>
    );
  }
}

class Buttons extends Accounts.ui.Buttons {}
class Button extends Accounts.ui.Button {
  render() {
    let {
      label,
      href = null,
      type,
      disabled = false,
      onClick,
      className,
      icon
    } = this.props;

    switch (icon) {
      case 'google':
        icon = 'googleplus';
      default:
        icon = 'ion-social-' + icon;
        break;
    }

    return type == 'link' ? (
      <a href={ href }
         style={{cursor: 'pointer'}}
         className={ [
           'button',
           className
         ].join(' ') }
         onClick={ onClick }>{ icon ? (<i className={["icon", icon].join(' ')} />) : null }{ label }</a>
    ) : (
      <button className={ [
                'button button-block',
                className,
                type == 'submit' ? 'button-energized' : '',
                disabled ? 'disabled' : '',
                icon ? 'icon-left ' + icon : ''
              ].join(' ') }
              type={ type } 
              disabled={ disabled }
              onClick={ onClick }>{ label }</button>
    );
  }
}
class Fields extends Accounts.ui.Fields {
  render () {
    let { fields = {}, className, formState } = this.props;
    return (
      <div className={ className }>
        {Object.keys(fields).map((id, i) =>
          <Accounts.ui.Field {...fields[id]} key={i} formState={ formState } />
        )}
      </div>
    );
  }
}
class Field extends Accounts.ui.Field {
  render() {
    let {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className = "item item-input",
      defaultValue = "",
      formState
    } = this.props;

    let placeholder = hint;

    switch (formState) {
      case STATES.SIGN_IN:
        placeholder = null;
        break;
      case STATES.SIGN_UP:
      default:
        className += " item-stacked-label";
        placeholder = hint;
        break;
    }

    const { mount = true } = this.state;
    return mount ? (
      <label className={[ className, required ? "required" : ""].join(' ')}>
        <span className="input-label">{ label }</span>
        <input id="password" name="password" style={{display: 'none'}} />
        <input id={ id }
               name={ id }
               type={ type }
               ref={ (ref) => this.input = ref }
               autoCapitalize={ type == 'email' ? 'none' : false }
               autoCorrect="off"
               onChange={ onChange }
               placeholder={ placeholder } defaultValue={ defaultValue } />
      </label>
    ) : null;
  }
}
export class PasswordOrService extends Accounts.ui.PasswordOrService {
  render() {
    let { className, style = {}, formState } = this.props;
    let { hasPasswordService, services } = this.state;
    labels = services;
    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService && services.length > 0) {
      return (
        <p style={ style } className={ className }>
          { formState == STATES.SIGN_UP ?
            `${ T9n.get('signUp') } ${ T9n.get('with') } ${ labels.join(' / ') }`
          : null }
          { formState == STATES.SIGN_IN ?
            `${ T9n.get('signIn') } ${ T9n.get('with') } ${ labels.join(' / ') }`
          : null }
        </p>
      );
    }
    return null;
  }
}
class SocialButtons extends Accounts.ui.SocialButtons {
  render() {
    const { oauthServices = {}, className = "social-buttons", formState } = this.props;
    return(
      <div className={ className }>
        {Object.keys(oauthServices).map((id, i) => {
          var mapObj = {
            "meteor-developer": ""
          };
          let serviceClass = id.replace(/meteor\-developer/gi, (matched) => {
            return mapObj[matched];
          });
          const serviceName = oauthServices[id].label;
          let label = oauthServices[id].label;
          if (formState == STATES.SIGN_UP) {
             label = `${ T9n.get('signUp') } ${ T9n.get('with') } ${ serviceName }`;
          }
          else if (formState == STATES.SIGN_IN) {
            label =  `${ T9n.get('signIn') } ${ T9n.get('with') } ${ serviceName }`;
          }
          return (
            <Accounts.ui.Button
              key={i}
              className={["ui button", serviceClass].join(' ')}
              icon={serviceClass}
              {..._.omit(oauthServices[id], "className")}
              label={ label }
            />
          );
        })}
      </div>
    );
  }
}
class FormMessage extends Accounts.ui.FormMessage {
  componentWillReceiveProps(nextProps, nextState) {
    var ionUpdatePopup = this.context.ionUpdatePopup;
    let { message, type = 'error'} = nextProps;

    if (message && (this.state || {}).message == message) {
      this.setState({ message: null });
      return;
    }

    var ionPopup = this.context.ionPopup;
    if (this.timeout == null && message && _.isEmpty(ionPopup)) {
      this.timeout = setTimeout(() => {
        // Check so that we're still mounted.
        if (typeof this._reactInternalInstance !== 'undefined') {
          ionUpdatePopup({
            popupType: 'alert',
            title: T9n.get(`alert.type.${type}`),
            template: message,
            okText: T9n.get('alert.ok'),
            onOk: () => {
              this.timeout = null;
              this.setState({ message: message });
            }
          });
        }
      }, 500);
    }
  }
  render() {
    return null;
  }
}
FormMessage.contextTypes = {
  ionPopup: React.PropTypes.object,
  ionUpdatePopup: React.PropTypes.func
};
// Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid
// overwriting this one, but have a look at it and learn how it works. And pull
// requests altering how that works are welcome.

// Alter provided default unstyled UI.
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.PasswordOrService = PasswordOrService;
Accounts.ui.SocialButtons = SocialButtons;
Accounts.ui.FormMessage = FormMessage;

// Export the themed version.
export { Accounts, STATES };
export default Accounts;
