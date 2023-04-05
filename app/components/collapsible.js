import React, {useState, useEffect, useRef} from "react"
// import { useRouter } from 'next/router'

import { useNavigate } from "react-router-dom";

const Collapsible = ({children, trigger, open, slug}) => {
	// const router = useRouter()
  const navigate = useNavigate();
  const [openDiv, setOPenDiv] = useState("");
	const contentRef = useRef();

	useEffect(() => {
    setOPenDiv(open);
		setTimeout(function() {
			if (document.getElementById(window.location.hash.replace('#', '') + "-content")){
				document.getElementById(window.location.hash.replace('#', '') + "-content").style.height = document.getElementById(window.location.hash.replace('#', '') + "-content").scrollHeight + 'px';
        document.getElementById(window.location.hash.replace('#', '') + "-content").classList.add('open');
				window.scrollTo({
					top: document.getElementById(window.location.hash.replace('#', ''))?.offsetTop,
					behavior: 'smooth'
				});
				
			}
		}, 100);
	})


	const toggle = (e) => {
		if (openDiv == false){
      setOPenDiv(true);
      navigate(`#${e.target.parentElement.id}`);
		} else {
      setOPenDiv(false);
			navigate(`#${e.target.id}`);
		}
	};

  return (
    <div className="Collapsible" id={slug}>
			<div onClick={toggle} id={`${slug}`} className="trigger">
        <span>{trigger}</span>
      </div>
			<div className={`content-parent ${openDiv ? "open" : "closed"}`} id={`${slug}-content`} ref={contentRef} style={openDiv ? { height: contentRef.current?.scrollHeight +
  "px" } : { height: "0px" }}>
				<div className='collapsible-content'>{children}</div>
			</div>
		</div>
  );
};

export default Collapsible