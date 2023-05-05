import React, {useEffect} from "react"
import { useNavigate } from "react-router-dom";

const Collapsible = ({children, trigger, open, slug}) => {
  const navigate = useNavigate();

	useEffect(() => {
		setTimeout(function() {
			if (document.getElementById(window.location.hash.replace('#', '') + "-content")){
				document.getElementsByClassName('open')[0]?.classList.remove('open');
        document.getElementById(window.location.hash.replace('#', '') + "-content").classList.add('open');
				setTimeout(function() {
					window.scrollTo({
						top: document.getElementById(window.location.hash.replace('#', ''))?.offsetTop - 75,
						behavior: 'smooth'
					});
				}, 500);
			}
		}, 100);
	})


	const toggle = (e) => {
		navigate(`#${e.target.parentElement.id}`);
	};

  return (
    <div className="Collapsible" id={slug}>
			<div id={`${slug}`} onClick={toggle} className="trigger">
        <span>{trigger}</span>
      </div>
			<div className={`content-parent`} id={`${slug}-content`} >
				<div className='collapsible-content'>{children}</div>
			</div>
		</div>
  );
};

export default Collapsible