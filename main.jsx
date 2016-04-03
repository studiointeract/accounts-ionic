import React from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui';

/**
 * Form.propTypes = {
 *   fields: React.PropTypes.object.isRequired,
 *   buttons: React.PropTypes.object.isRequired,
 *   error: React.PropTypes.string,
 *   ready: React.PropTypes.bool
 * };
 */
class Form extends Accounts.ui.Form {
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
    return (
      <form ref={(ref) => this.form = ref} className={[ "accounts ui form", className ].join(' ')}>
        {Object.keys(fields).length > 0 ? (
          <Accounts.ui.Fields fields={ fields } />
        ): null }
        { buttons['switchToPasswordReset'] ? (
          <div className="field">
            <Accounts.ui.Button {...buttons['switchToPasswordReset']} />
          </div>
        ): null }
        {_.values(_.omit(buttons, 'switchToPasswordReset', 'switchToSignIn',
          'switchToSignUp', 'switchToChangePassword', 'switchToSignOut', 'signOut')).map((button, i) =>
          <Button {...button} key={i} />
        )}
        { buttons['signOut'] ? (
          <Button {...buttons['signOut']} type="submit" />
        ): null }
        { buttons['switchToSignIn'] ? (
          <Button {...buttons['switchToSignIn']} type="link" className="ui button" />
        ): null }
        { buttons['switchToSignUp'] ? (
          <Button {...buttons['switchToSignUp']} type="link" className="ui button" />
        ): null }
        { buttons['switchToChangePassword'] ? (
          <Button {...buttons['switchToChangePassword']} type="link" className="ui button" />
        ): null }
        { buttons['switchToSignOut'] ? (
          <Button {...buttons['switchToSignOut']} type="link" className="ui button" />
        ): null }
        { formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
          <div className="or-sep">
            <Accounts.ui.PasswordOrService oauthServices={ oauthServices } />
          </div>
        ) : null }
        { formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
            <Accounts.ui.SocialButtons oauthServices={ oauthServices } />
        ) : null }
        <Accounts.ui.FormMessage className="ui message" style={{display: 'block'}} {...message} />
      </form>
    );
  }
}

class Buttons extends Accounts.ui.Buttons {}
class Button extends Accounts.ui.Button {
  render() {
    const {
      label,
      href = null,
      type,
      disabled = false,
      onClick,
      className,
      icon
    } = this.props;
    return type == 'link' ? (
      <a href={ href }
         style={{cursor: 'pointer'}}
         className={ className }
         onClick={ onClick }>{ icon ? (<i className={["icon", icon].join(' ')} />) : null }{ label }</a>
    ) : (
      <button className={ [
                'ui button',
                type == 'submit' ? 'primary' : '',
                disabled ? 'disabled' : '',
                className
              ].join(' ') }
              type={ type } 
              disabled={ disabled }
              onClick={ onClick }>{ icon ? (<i className={["icon", icon].join(' ')} />) : null }{ label }</button>
    );
  }
}
class Fields extends Accounts.ui.Fields {
  render () {
    let { fields = {}, className = "field" } = this.props;
    return (
      <div className={ className }>
        {Object.keys(fields).map((id, i) =>
          <Accounts.ui.Field {...fields[id]} key={i} />
        )}
      </div>
    );
  }
}
class Field extends Accounts.ui.Field {
  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      className,
      defaultValue = ""
    } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <div className={["ui field", required ? "required" : ""].join(' ')}>
        <label htmlFor={ id }>{ label }</label>
        <div className="ui fluid input">
          <input id="password" name="password" style={{display: 'none'}} />
          <input id={ id }
                 name={ id }
                 type={ type }
                 autoCapitalize={ type == 'email' ? 'none' : false }
                 autoCorrect="off"
                 onChange={ onChange }
                 placeholder={ hint } defaultValue={ defaultValue } />
        </div>
      </div>
    ) : null;
  }
}
export class PasswordOrService extends Accounts.ui.PasswordOrService {
  render() {
    let { className, style = {} } = this.props;
    let { hasPasswordService, services } = this.state;
    labels = services;
    if (services.length > 2) {
      labels = [];
    }

    if (hasPasswordService && services.length > 0) {
      return (
        <p style={ style } className={ className }>
          { `${T9n.get('or use')} ${ labels.join(' / ') }` }
        </p>
      );
    }
    return null;
  }
}
class SocialButtons extends Accounts.ui.SocialButtons {
  render() {
    let { oauthServices = {}, className = "social-buttons" } = this.props;
    return(
      <div className={ className }>
        {Object.keys(oauthServices).map((id, i) => {
          var mapObj = {
             google:"google plus",
             "meteor-developer": ""
          };
          let serviceClass = id.replace(/google|meteor\-developer/gi, (matched) => {
            return mapObj[matched];
          });
          return (
            <Accounts.ui.Button key={i}
                                className={["ui button", serviceClass].join(' ')}
                                icon={serviceClass} {...oauthServices[id]} />
          );
        })}
      </div>
    );
  }
}
class FormMessage extends Accounts.ui.FormMessage {}
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
