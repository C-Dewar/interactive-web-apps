/* styles.css */

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  font-family: sans-serif;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.9);
}

.table {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  white-space: nowrap;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 1);
}

.table__cell {
  width: 5rem;
  height: 5rem;
  align-items: center;
  justify-content: center;
  border-collapse: collapse;
  border-right: 1px solid rgb(0, 0, 0, 0.1);
  border-bottom: 1px solid rgb(0, 0, 0, 0.1);
  text-align: center;
  font-weight: bold;
}

.table__cell_heading {
  border-bottom: 1px solid rgb(0, 0, 0, 1);
  background: rgba(0, 0, 0, 0.9);
  color: white;
}

.table__cell_today {
  color: blue;
  background: rgba(0, 0, 255, 0.1);
}

.table__cell_sidebar {
  color: rgba(0, 0, 0, 0.8);
  border-right: 1px solid rgb(0, 0, 0, 0.2);
  font-weight: normal;
  font-size: 0.8rem;
}

.table__cell_weekend {
  font-weight: normal;
  color: rgba(0, 0, 0, 0.6);
}

.table__cell_alternate {
  background: rgba(0, 0, 0, 0.05);
}