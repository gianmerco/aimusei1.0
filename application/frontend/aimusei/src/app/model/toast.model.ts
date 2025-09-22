export interface Toast{
    title?: string;
    msg: string;
    type?: 'SUCCESS' | 'WARNING' | 'ERROR'; 
    id?: number;
}