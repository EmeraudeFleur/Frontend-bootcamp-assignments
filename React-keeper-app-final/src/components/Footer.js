import React from "react";

export default function Footer() {
  // const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright &copy; {new Date().getFullYear()}</p>
    </footer>
  );
}
