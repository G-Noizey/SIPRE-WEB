// App.jsx

import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Admin/Login';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
