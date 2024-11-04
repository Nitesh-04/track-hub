export interface Application {
  id: string;
  companyName: string;
  stipend: number | null;
  ctc: number | null;
  role: string;
  location: string;
  link: string | null;
  notifications: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Round {
  id: string;
  roundTitle: string;
  roundDateTime: Date;
  venue: string;
  roundLink: string | null;
  status: "upcoming" | "completed";
  applicationId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationData = {
  companyName: string;
  stipend: number;
  role: string;
  ctc: number;
  location: string;
  link: string;
  notifications: boolean;
};

export type RoundData = {
  roundTitle: string;
  roundDateTime: number;
  venue: string;
  roundLink: string;
  status: "upcoming" | "completed";
};

export type EditApplicationProps = {
  application: {
    id: string;
    companyName: string;
    stipend: number | null;
    ctc: number | null;
    role: string;
    location: string;
    link: string | null;
    notifications: boolean;
  };
  onUpdate: () => void;
};

export type EditRoundProps = {
  round: {
    id: string;
    roundTitle: string;
    roundDateTime: Date;
    venue: string;
    roundLink: string | null;
    status: "upcoming" | "completed";
  };
  onUpdate: () => void;
};
