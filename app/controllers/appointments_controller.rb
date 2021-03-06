class AppointmentsController < ApplicationController
      
      def date_picker
          if user_signed_in?
          @appointments = Appointment.where(:garage_id => params[:garage_id], :date => params[:date1]..params[:date2])
          render :'appointments/appointment.html'
          else
              redirect_to user_session_path
          end
      end


      def index
          if user_signed_in?
            @appointments = Appointment.where(garage_id: params[:garage_id])
            @garage = Garage.find_by_id(params[:garage_id])
            @customers = Garage.where(garage_id: params[:garage_id])
          respond_to do |format|
            format.html { render :index}
            format.json {render json: @appointments}
          end
          else
            redirect_to user_session_path
          end
      end
  

      def show
        if user_signed_in?
           @appointment = Appointment.find(params[:id])
          respond_to do |format|
          format.html { render :show}
          format.json {render json: @appointment}
        end
        else
          redirect_to user_session_path
        end
      end

      def new
         @appointment = Appointment.new(garage_id: params[:format].to_i)
         @appointment.build_customer
         @appointment.build_vehicle
         @appointment.customer.garage_id = params[:format].to_i
       end

      def create
          if user_signed_in?
            user = current_user
           @appointment = Appointment.new(appointment_params)
           if @appointment.save
            garage = @appointment.garage
            redirect_to garage_appointments_path(garage)
          else 
           flash[:alert] = @appointment.errors.full_messages
           redirect_to user_session_path
          end
        end
      end
      

      def edit
         if user_signed_in?
         @appointment = Appointment.find_by(id: params[:id])
        else
          redirect_to user_session_path
         end
      end

      def update
          if user_signed_in?
            @appointment = Appointment.find_by_id(params[:id])
            @appointment.update(appointment_params)
            @appointment.vehicle.customer_id = @appointment.customer_id
            @appointment.vehicle.save
            @user = current_user
         else
          redirect_to user_session_path
        end
      end

      def destroy
         if user_signed_in?
         appointment = Appointment.find(params[:id])
         g = appointment.garage
        appointment.destroy
         redirect_to garage_appointments_path(g)
         else
         redirect_to user_session_path
         end
      end
  


       def appointment_params
         params.require(:appointment).permit(:description, :date, :garage_id, :customer_id,
         :customer_attributes => [:first_name, :last_name ,:standing_balance, :email,:garage_id],
         :vehicle_attributes => [:year, :make ,:model, :mileage, :license_plate, :color, :customer_id] )
       end
end
