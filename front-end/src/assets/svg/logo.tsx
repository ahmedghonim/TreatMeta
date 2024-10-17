import React from "react";

const LogoPage = (props: any) => {
  return (
    <>
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="56"
        height="51"
        viewBox="0 0 56 51"
        fill="none"
      >
        <path
          d="M13.6511 33.8597V43.1733H4.09277V16.3992L27.9885 33.8597L51.8843 16.3992V43.1733H42.326V33.8597L27.9885 44.3351L13.6511 33.8597Z"
          fill="white"
        />
        <path
          d="M38.2189 7.927H21.3965"
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M41.7393 12.9233H23.4287"
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M34.7754 18.2017H42.4402"
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M44.0851 3.38013H16.9365"
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M32.2713 21.6489H19.7559"
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M44.4958 2.69165H43.127V4.06383H44.4958V2.69165Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M38.9011 7.23853H37.5322V8.6107H38.9011V7.23853Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M42.4206 12.2349H41.0518V13.607H42.4206V12.2349Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M43.1267 17.5132H41.7578V18.8854H43.1267V17.5132Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M32.9529 20.9651H31.584V22.3373H32.9529V20.9651Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M35.4577 17.5132H34.0889V18.8854H35.4577V17.5132Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M24.115 12.2349H22.7461V13.607H24.115V12.2349Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M20.4382 20.9651H19.0693V22.3373H20.4382V20.9651Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M22.0837 7.23853H20.7148V8.6107H22.0837V7.23853Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M17.6238 2.69165H16.2549V4.06383H17.6238V2.69165Z"
          fill={props.color || "#F05445"}
          stroke={props.color || "#F05445"}
          stroke-width="0.25"
          stroke-miterlimit="10"
        />
        <path
          d="M34.5412 26.6882L35.8528 25.3734C35.8719 25.3543 35.8719 25.3256 35.8528 25.3064L34.5412 23.9916C34.5221 23.9725 34.4935 23.9725 34.4744 23.9916L33.1627 25.3064C33.1437 25.3256 33.1437 25.3543 33.1627 25.3734L34.4744 26.6882C34.4935 26.7073 34.5269 26.7073 34.5412 26.6882Z"
          fill={props.color || "#F05445"}
        />
        <path
          d="M30.5207 45.1192H51.0014L55.6327 40.8641H56L54.3402 50.9857H1.60259L0 40.9071H0.367262L4.92224 45.1049L25.4554 45.2579V0.152995L30.5017 0L30.5207 45.1192ZM55.0985 50.9809V51L55.1176 50.9809H55.0985ZM55.1176 50.9809L55.1367 50.9426V50.9809H55.1176Z"
          fill={props.color || "#F05445"}
        />
      </svg>
      <span className="mt-1 text-white">TreatMeta</span>
    </>
  );
};

export default LogoPage;
