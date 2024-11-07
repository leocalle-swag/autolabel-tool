import React from 'react';
import { Trash2} from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Button } from '../ui/button';

interface ResetButtonProps {

  handleReset: () => void;
  isProcessing?: boolean;
}

export const ResetButton: React.FC<ResetButtonProps> = ({isProcessing,handleReset}) => {

    return (
    <div className='min-w-full mt-2'>
    <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button
                variant="destructive"
                className="items-center w-full"
                disabled={isProcessing}
            >
                <Trash2 size={16} />
                Reset Dataset
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro di voler resettare il dataset?</AlertDialogTitle>
                <AlertDialogDescription>
                    Questa azione eliminerà tutte le images caricate, le etichette generate
                    e le modifiche salvate. Non è possibile annullare questa operazione.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction
                    onClick={handleReset}
                    className="bg-destructive hover:bg-destructive/90"
                >
                    Reset
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </div>
    )
    
}

