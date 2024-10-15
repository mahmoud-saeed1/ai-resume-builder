// export interface IIcon extends React.SVGProps<SVGSVGElement> {
//   className?: string;
// }

export interface IIcon {
  className?: string;
}

export interface IUserResume {
  data: {
    title: string;
    resumeId: string;
    userEmail: string | undefined;
    userName: string | null | undefined;
  };
}
