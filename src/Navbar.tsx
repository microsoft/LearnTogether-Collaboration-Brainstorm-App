import { Login } from '@microsoft/mgt-react';

export function Navbar() {
    return (
        <header>
          <div className="container">
            <div className="title">Let's Brainstorm</div>
            <div className="login">
              <Login></Login>
            </div>
          </div>
        </header>
      );
}