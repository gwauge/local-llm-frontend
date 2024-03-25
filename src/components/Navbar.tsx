import Logo from "../assets/zentrum-berlin.svg";
export default function Navbar() {
    return (
        <nav className='navbar navbar-expand-lg bg-body-tertiary'>
            <div className='container-fluid'>
                <a href="https://digitalzentrum-berlin.de">
                    <img
                        src={Logo}
                        className=""
                        alt="Mittelstand-Digital Zentrum Logo"
                        style={{ width: "240px" }}
                    />
                </a>
                {/* <img src={Logo} style={{ width: "10rem" }} /> */}
                <h1>Kundensupport Demo</h1>
            </div>
        </nav>
    )
}
