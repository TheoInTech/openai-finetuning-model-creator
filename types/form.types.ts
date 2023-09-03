export interface IPromptItem {
  system: string;
  user: string;
  assistant: string;
}

export interface IFormProps {
  apiKey: string;
  model: string;
  suffix: string;
  file: any;
}

export enum Models {
  GPT3 = "gpt-3.5-turbo-0613",
  BABBAGE = "babbage-002",
  DAVINCI = "davinci-002",
}

export interface FileUploadedProps {
  object: string;
  id: string;
  purpose: string;
  filename: string;
  bytes: number;
  created_at: number;
  status: string;
  status_details: any;
}

export interface FinetuningDeployedProps {
  object: string;
  id: string;
  model: string;
  created_at: number;
  finished_at: number;
  fine_tuned_model: string;
  organization_id: string;
  result_files: string[];
  status: string;
  validation_file: string;
  training_file: string;
  hyperparameters: {
    n_epochs: number;
  };
  trained_tokens: number;
}
