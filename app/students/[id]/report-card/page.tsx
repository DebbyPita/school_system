"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ReportCard } from "@/components/report-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileText } from "lucide-react";

const formSchema = z.object({
  term: z.string().min(1, { message: "Please select a term" }),
  academicYear: z
    .string()
    .min(1, { message: "Please select an academic year" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ReportCardPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const [showReportCard, setShowReportCard] = useState(false);
  const [selectedValues, setSelectedValues] = useState<FormValues>({
    term: "",
    academicYear: "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: "",
      academicYear: "",
    },
  });

  function onSubmit(data: FormValues) {
    setSelectedValues(data);
    setShowReportCard(true);
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className="container py-10 px-10">
      {!showReportCard ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Report Card
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Term</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select term" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Term 1">Term 1</SelectItem>
                            <SelectItem value="Term 2">Term 2</SelectItem>
                            <SelectItem value="Term 3">Term 3</SelectItem>
                            <SelectItem value="Final">Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select academic year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 5 }, (_, i) => {
                              const year = currentYear - 2 + i;
                              const displayValue = `${year}-${year + 1}`;
                              return (
                                <SelectItem key={year} value={year.toString()}>
                                  {displayValue}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit">Generate Report Card</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <Button variant="outline" onClick={() => setShowReportCard(false)}>
              Back to Selection
            </Button>
          </div>
          <ReportCard
            studentId={studentId}
            term={selectedValues.term}
            academicYear={selectedValues.academicYear}
          />
        </>
      )}
    </div>
  );
}
