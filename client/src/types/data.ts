export interface User {
  id: string;
  githubId: string;
  userName: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  profileUrl?: string;
  bio?: string;
  location?: string;
  company?: string;
  blog?: string;
  createdAt: Date;
  githubCreatedAt: Date;
  updatedAt: Date;
}
export interface Project {
  id: string;
  projectName: string;
  gitUrl: string;
  createdAt: string;
  env:string;
  branch:string;
  installCommand:string;
  buildCommand:string;
  lastDeployed:string;
  lastModified:string;
  isLive:boolean;
  srcDir:string
}

export interface Deployment {
  title: string;
  id: string;
  status: string;
  createdAt: string;
  projectId: string;
}
export interface Branch{
  name:string,
  commitSha:string,
  protected:boolean
}