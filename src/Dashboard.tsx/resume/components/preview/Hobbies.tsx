// preview/Hobbies.tsx
import { IHobby } from "@/interfaces";

const Hobbies = ({ hobbies }: { hobbies: IHobby[] }) => {
  return (
    <div className="resumePreview__hobbies">
      <h2 className="resumePreview__hobbies--heading">Hobbies</h2>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.id} className="resumePreview__hobbies--item">
            {hobby.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Hobbies;
