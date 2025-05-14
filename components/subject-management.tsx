"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Edit, Loader2, Plus, Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";

const subjectFormSchema = z.object({
  name: z.string().min(2, {
    message: "Subject name must be at least 2 characters.",
  }),
  code: z.string().min(2, {
    message: "Subject code must be at least 2 characters.",
  }),
  category: z.enum(["core", "elective", "extracurricular"]),
  description: z.string().optional(),
  gradeLevel: z.string().min(1, {
    message: "Grade level is required.",
  }),
});

type SubjectFormValues = z.infer<typeof subjectFormSchema>;

export function SubjectManagement() {
  const convex = useConvex();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);

  const form = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      category: "core",
      description: "",
      gradeLevel: "",
    },
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (editingSubject) {
      form.reset({
        name: editingSubject.name,
        code: editingSubject.code,
        category: editingSubject.category,
        description: editingSubject.description || "",
        gradeLevel: editingSubject.gradeLevel,
      });
    } else {
      form.reset({
        name: "",
        code: "",
        category: "core",
        description: "",
        gradeLevel: "",
      });
    }
  }, [editingSubject, form]);

  async function fetchSubjects() {
    setIsLoading(true);
    try {
      const fetchedSubjects = await convex.query(api.subjects.getAll);
      setSubjects(fetchedSubjects);
    } catch (error) {
      toast.error("Failed to fetch subjects");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(data: SubjectFormValues) {
    setIsSubmitting(true);
    try {
      if (editingSubject) {
        await convex.mutation(api.subjects.update, {
          id: editingSubject._id,
          ...data,
        });
        toast.success("Subject updated successfully");
      } else {
        await convex.mutation(api.subjects.create, data);
        toast.success("Subject added successfully");
      }
      setIsDialogOpen(false);
      fetchSubjects();
    } catch (error) {
      toast.error(
        editingSubject ? "Failed to update subject" : "Failed to add subject"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this subject?")) {
      try {
        await convex.mutation(api.subjects.remove, { id });
        toast.success("Subject deleted successfully");
        fetchSubjects();
      } catch (error) {
        toast.error("Failed to delete subject");
        console.error(error);
      }
    }
  }

  function handleEdit(subject: any) {
    setEditingSubject(subject);
    setIsDialogOpen(true);
  }

  function handleAddNew() {
    setEditingSubject(null);
    setIsDialogOpen(true);
  }

  return (
    <div className="space-y-6 px-10">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Subject
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : subjects.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">No subjects found</p>
              <Button onClick={handleAddNew} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Subject
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Grade Level</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject._id}>
                    <TableCell className="font-medium">
                      {subject.name}
                    </TableCell>
                    <TableCell>{subject.code}</TableCell>
                    <TableCell className="capitalize">
                      {subject.category}
                    </TableCell>
                    <TableCell>{subject.gradeLevel}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(subject)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(subject._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubject ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
            <DialogDescription>
              {editingSubject
                ? "Update the subject details below."
                : "Fill in the details to add a new subject."}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject Code</FormLabel>
                    <FormControl>
                      <Input placeholder="MATH101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="core">Core</SelectItem>
                          <SelectItem value="elective">Elective</SelectItem>
                          <SelectItem value="extracurricular">
                            Extracurricular
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gradeLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade Level</FormLabel>
                      <FormControl>
                        <Input placeholder="Grade 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the subject"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional description of the subject content.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingSubject ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingSubject ? "Update Subject" : "Add Subject"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
