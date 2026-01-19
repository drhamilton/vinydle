export interface ObscureState {
  revealedCells: boolean[];
  totalCells: number;
}

export interface ObscureStrategy {
  name: string;
  totalCells: number;
  createInitialState(): ObscureState;
  revealNext(state: ObscureState): ObscureState;
  revealAll(state: ObscureState): ObscureState;
  getCellStyle(cellIndex: number, state: ObscureState): React.CSSProperties;
}
