"use client";

interface ITask {
  label: string;
  createdAt?: Date;
  completed: boolean;
  completedAt?: Date;
}

export class Task implements ITask {
  label: string;
  createdAt: Date;
  completed: boolean;
  completedAt?: Date;

  constructor(label: string) {
    this.label = label;
    this.createdAt = new Date();
    this.completed = false;
  }
}
