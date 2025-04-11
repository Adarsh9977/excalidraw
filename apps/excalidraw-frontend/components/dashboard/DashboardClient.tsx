'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Grid3X3, Calendar, Users, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import { Board, createBoard, deleteBoardById } from '@/lib/api/boards';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';


interface DashboardClientProps {
  initialBoards: Board[];
}

export const DashboardClient = ({ initialBoards }: DashboardClientProps) => {
  const [boards, setBoards] = useState<Board[]>(initialBoards);
  const [newBoardName, setNewBoardName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);
  const [createBoardLoading, setCreateBoardLoading ] = useState(false);
  const router = useRouter();
  const { userId, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userId) {
      const pendingInvitation = localStorage.getItem('pendingInvitation');
      if (pendingInvitation) {
        localStorage.removeItem('pendingInvitation');
        router.push(`/join/${pendingInvitation}`);
      } else {
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, userId, router]);
  
  const createNewBoard = async () => {
    setCreateBoardLoading(true);
    if (!newBoardName.trim()) {
      toast.error('Please enter a board name');
      setCreateBoardLoading(false);
      return;
    }
    if(boards.find(board => board.slug === newBoardName.trim())){
      toast.error('Board name already exists');
      setCreateBoardLoading(false);
      return;
    }

    try {
      const newBoard = await createBoard(newBoardName);
      console.log(newBoard);

      if(newBoard?.status === 200){
        setCreateBoardLoading(false);
        setBoards([...boards, newBoard.data]);
        setNewBoardName('');
        setIsDialogOpen(false);
        toast.success('New board created successfully!');
      }
    } catch (error) {
      setCreateBoardLoading(false);
      setNewBoardName('');
      toast.error(`${error}`);
    }

  };

  const deleteBoard =async (boardId: string) => {
    setBoardToDelete(null);
    const res = await deleteBoardById(boardId);
    if(res?.status === 200){
      setBoards(boards.filter(board => board.id !== boardId));
      toast.success('Board deleted successfully!');
    }else{
      toast.error('Error deleting board');
    }
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
              <Plus size={16} />
              New Board
            </Button>
          </DialogTrigger>
          <DialogContent className="border-violet-200 dark:border-violet-800">
            <DialogHeader>
              <DialogTitle>Create New Whiteboard</DialogTitle>
              <DialogDescription>
                Give your whiteboard a name to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="boardName">Board Name</Label>
              <Input
                id="boardName"
                placeholder="My Awesome Whiteboard"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="mt-2 focus-visible:ring-violet-500"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button disabled={createBoardLoading} onClick={createNewBoard} className="bg-violet-600 hover:bg-violet-700 text-white">
                { createBoardLoading ? 'Creating...' : 'Create Board' }
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create new board card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="h-full border-dashed border-violet-300 dark:border-violet-700 cursor-pointer hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-colors">
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div onClick={()=>{
                setIsDialogOpen(true);
              }} className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/20">
                <Plus className="h-10 w-10" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-violet-800 dark:text-violet-300">Create New Board</h3>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                Start with a blank whiteboard
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Existing boards */}
        {boards.map((board: Board, index) => (
          <motion.div 
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className=''
          >
            <Card className="h-full cursor-pointer border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all py-0 overflow-hidden group">
              <CardHeader className="bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/30 p-4">
                <CardTitle className="text-violet-800 dark:text-violet-300">{board.slug}</CardTitle>
                <CardDescription>
                  Last updated {formatDate(board.updatedAt)}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pt-6">
                <div className="h-32 bg-white dark:bg-slate-900 rounded-md flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-100/50 via-transparent to-purple-100/50 dark:from-violet-900/20 dark:via-transparent dark:to-purple-900/20 opacity-70"></div>
                  <Grid3X3 className="h-12 w-12 text-violet-300 dark:text-violet-700" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10 p-3">
                <div className="flex items-center text-sm text-muted-foreground gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-violet-500" />
                    <span>{formatDate(board.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={14} className="text-violet-500" />
                    <span>{board.collaborators ? board.collaborators.length : 0}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <AlertDialog open={boardToDelete === board.id} onOpenChange={(isOpen) => !isOpen && setBoardToDelete(null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBoardToDelete(board.id);
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the board
                          and all of its contents.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setBoardToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteBoard(board.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-violet-600 hover:text-violet-800 hover:bg-violet-100 dark:text-violet-400 dark:hover:text-violet-300 dark:hover:bg-violet-900/50"
                    onClick={() => router.push(`/canvas/${board.id}`)}
                  >
                    <Pencil size={14} className="mr-1" /> Open
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};